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
    public class EmpresaService : IEmpresaService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IEmpresaRepository _empresaRepository;
        private readonly IS3Service _s3Service;

        public EmpresaService(IMapper mapper, ILoggerFactory loggerFactory,
            IEmpresaRepository empresaRepository, IS3Service s3Service)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<EmpresaService>();
            _empresaRepository = empresaRepository;
            _s3Service = s3Service;
        }

        public async Task<Result<EmpresaResponse>> BuscarPorIdAsync(int idEmpresa, CancellationToken cancellationToken)
        {
            var empresaFound = await _empresaRepository.BuscarPorIdAsync(idEmpresa, cancellationToken);

            if (empresaFound is null)
                return Result<EmpresaResponse>.Failure(new NoRecordsError(Compartilhado.Empresa.EmpresaIdNaoEncontrado));

            var result = _mapper.Map<EmpresaResponse>(empresaFound);
            return Result<EmpresaResponse>.Success(result);
        }

        public async Task<Result<EmpresaDataResponse>> BuscarTodosAsync(EmpresaFilter filter, CancellationToken cancellationToken)
        {
            var empresaFound = await _empresaRepository.BuscarTodosAsync(filter, cancellationToken);

            if (empresaFound.TotalRegistros is 0)
                return Result<EmpresaDataResponse>.Failure(new NoRecordsError(Compartilhado.Empresa.EmpresasNaoEncontradas));

            var mapped = _mapper.Map<List<EmpresaResponse>>(empresaFound.Items);
            var result = new EmpresaDataResponse
            {
                Data = mapped,
                TotalRegisters = empresaFound.TotalRegistros,
            };

            return Result<EmpresaDataResponse>.Success(result);
        }

        public async Task<Result<CriarEmpresaResponse>> InserirAsync(CriarEmpresaRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new CriarEmpresaValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<CriarEmpresaResponse>.Failure(new ValidationError(validation.Errors));

                //Faz primeiro o upload do logo da empresa.
                var _upload = await _s3Service.UploadLogoAsync(requisicao.Logo);

                var empresa = new EmpresaEntidade(requisicao.Nome, _upload);
                empresa = await _empresaRepository.InserirAsync(empresa, cancellationToken);
                var result = _mapper.Map<CriarEmpresaResponse>(empresa);

                return Result<CriarEmpresaResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<CriarEmpresaResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<AtualizarEmpresaResponse>> AtualizarAsync(AtualizarEmpresaRequest requisicao, CancellationToken cancellationToken)
        {
            try
            {
                var validation = await new AtualizarEmpresaValidacao().ValidateAsync(requisicao, cancellationToken);

                if (!validation.IsValid)
                    return Result<AtualizarEmpresaResponse>.Failure(new ValidationError(validation.Errors));

                var empresaFound = await _empresaRepository.BuscarPorIdAsync(requisicao.EmpresaId, cancellationToken);

                if (empresaFound is null)
                    return Result<AtualizarEmpresaResponse>.Failure(new NotFoundError(Compartilhado.Empresa.EmpresaIdNaoEncontrado));

                /*Verifica se o registro tem logo atualmente e se foi informado um novo logo*/
                if (requisicao.Logo != null && !string.IsNullOrWhiteSpace(empresaFound.Logo))
                {
                    //Apaga o arquivo anteriormente salvo no bucket.
                    await _s3Service.ApagarLogo(empresaFound.Logo);
                }

                if (requisicao.Logo != null)
                {
                    //Faz agora o upload do logo da empresa.
                    var _upload = await _s3Service.UploadLogoAsync(requisicao.Logo);
                    empresaFound.Logo = _upload;
                }

                empresaFound.Nome = requisicao.Nome;

                await _empresaRepository.AtualizarAsync(empresaFound, cancellationToken);
                var result = _mapper.Map<AtualizarEmpresaResponse>(empresaFound);

                return Result<AtualizarEmpresaResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<AtualizarEmpresaResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<Result<DeletarEmpresaResponse>> DeletarAsync(int idEmpresa, CancellationToken cancellationToken)
        {
            try
            {
                var empresaFound = await _empresaRepository.BuscarPorIdAsync(idEmpresa, cancellationToken);

                if (empresaFound is null)
                    return Result<DeletarEmpresaResponse>.Failure(new NoRecordsError(Compartilhado.Empresa.EmpresaIdNaoEncontrado));

                empresaFound.Delete();
                await _empresaRepository.DeletarAsync(empresaFound, cancellationToken);

                var result = new DeletarEmpresaResponse(Compartilhado.Empresa.EmpresaRemovida);

                return Result<DeletarEmpresaResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeletarEmpresaResponse>.Failure(new UnknownError(ex.Message));
            }
        }
    }
}