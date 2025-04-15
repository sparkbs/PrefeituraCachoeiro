using AutoMapper;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class PrefeituraService : IPrefeituraService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IPrefeituraRepository _prefeituraRepository;
        private readonly IS3Service _s3Service;

        public PrefeituraService(IMapper mapper, ILoggerFactory loggerFactory, 
            IPrefeituraRepository prefeituraRepository, IS3Service s3Service)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<PrefeituraService>();
            _prefeituraRepository = prefeituraRepository;
            _s3Service = s3Service;
        }

        public async Task<Result<PrefeituraResponse>> BuscarPorIdAsync(int idPrefeitura, CancellationToken cancellationToken)
        {
            var prefeituraFound = await _prefeituraRepository.BuscarPorIdAsync(idPrefeitura, cancellationToken);

            if (prefeituraFound is null)
                return Result<PrefeituraResponse>.Failure(new NoRecordsError(Compartilhado.Prefeitura.PrefeituraIdNaoEncontrado));

            var result = _mapper.Map<PrefeituraResponse>(prefeituraFound);
            return Result<PrefeituraResponse>.Success(result);
        }

        public async Task<Result<PrefeituraDataResponse>> BuscarTodosAsync(PrefeituraFilter filter, CancellationToken cancellationToken)
        {
            var prefeituraFound = await _prefeituraRepository.BuscarTodosAsync(filter, cancellationToken);

            if (prefeituraFound.TotalRegistros is 0)
                return Result<PrefeituraDataResponse>.Failure(new NoRecordsError(Compartilhado.Prefeitura.PrefeiturasNaoEncontradas));

            var mapped = _mapper.Map<List<PrefeituraResponse>>(prefeituraFound.Items);
            var result = new PrefeituraDataResponse
            {
                Data = mapped,
                TotalRegisters = prefeituraFound.TotalRegistros,
            };

            return Result<PrefeituraDataResponse>.Success(result);
        }

        public async Task<Result<CriarPrefeituraResponse>> InserirAsync(CriarPrefeituraRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new CriarPrefeituraValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<CriarPrefeituraResponse>.Failure(new ValidationError(validation.Errors));

                //Faz primeiro o upload do logo da prefeitura.
                var _upload = await _s3Service.UploadLogoAsync(requisicao.Logo);
                var prefeitura = new PrefeituraEntidade(requisicao.Nome, _upload)
                {
                    Email = requisicao.Email
                };

                prefeitura = await _prefeituraRepository.InserirAsync(prefeitura, cancellationToken);
                var result = _mapper.Map<CriarPrefeituraResponse>(prefeitura);

                return Result<CriarPrefeituraResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarPrefeituraResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<AtualizarPrefeituraResponse>> AtualizarAsync(AtualizarPrefeituraRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new AtualizarPrefeituraValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<AtualizarPrefeituraResponse>.Failure(new ValidationError(validation.Errors));

                var prefeituraFound = await _prefeituraRepository.BuscarPorIdAsync(requisicao.IdPrefeitura, cancellationToken);

                if (prefeituraFound is null)
                    return Result<AtualizarPrefeituraResponse>.Failure(new NotFoundError(Compartilhado.Prefeitura.PrefeituraIdNaoEncontrado));

                /*Verifica se o registro tem logo atualmente e se foi informado um novo logo*/
                if (requisicao.Logo != null && !string.IsNullOrWhiteSpace(prefeituraFound.Logo))
                {
                    //Apaga o arquivo anteriormente salvo no bucket.
                    await _s3Service.ApagarLogo(prefeituraFound.Logo);
                }

                if (requisicao.Logo != null)
                {
                    //Faz agora o upload do logo da prefeitura.
                    var _upload = await _s3Service.UploadLogoAsync(requisicao.Logo);

                    prefeituraFound.Logo = _upload;
                }

                prefeituraFound.Nome = requisicao.Nome;
                prefeituraFound.Email = requisicao.Email;

                await _prefeituraRepository.AtualizarAsync(prefeituraFound, cancellationToken);
                var result = _mapper.Map<AtualizarPrefeituraResponse>(prefeituraFound);

                return Result<AtualizarPrefeituraResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<AtualizarPrefeituraResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<DeletarPrefeituraResponse>> DeletarAsync(int idPrefeitura, CancellationToken cancellationToken)
        {
            try
            {
                var prefeituraFound = await _prefeituraRepository.BuscarPorIdAsync(idPrefeitura, cancellationToken);

                if (prefeituraFound is null)
                    return Result<DeletarPrefeituraResponse>.Failure(new NoRecordsError(Compartilhado.Prefeitura.PrefeituraIdNaoEncontrado));

                prefeituraFound.Delete();
                await _prefeituraRepository.DeletarAsync(prefeituraFound, cancellationToken);

                var result = new DeletarPrefeituraResponse(Compartilhado.Prefeitura.PrefeituraRemovida);

                return Result<DeletarPrefeituraResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarPrefeituraResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<MemoryStream> DownloadArquivoLogo(int prefeituraid, CancellationToken cancellationToken)
        {
            try
            {
                var _prefeituraFound = await _prefeituraRepository.BuscarPorIdAsync(prefeituraid, cancellationToken);

                if (_prefeituraFound != null)
                {
                    if (!string.IsNullOrEmpty(_prefeituraFound.Logo))
                    {
                        var _nomeArquivo = this._s3Service.ExtractFileNameFromUrl(_prefeituraFound.Logo);
                        var _stream = await this._s3Service.DownloadFileFromS3Async(_nomeArquivo);

                        return (_stream);
                    }
                }

                return (null);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}