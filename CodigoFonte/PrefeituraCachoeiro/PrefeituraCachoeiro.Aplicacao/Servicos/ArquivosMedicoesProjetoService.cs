using AutoMapper;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class ArquivosMedicoesProjetoService : IArquivosMedicoesProjetoService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IArquivosMedicoesProjetoRepository _arquivosMedicoesProjetoRepository;
        private readonly IApplicationUser _applicationUser;
        private readonly IUsuariosRepository _usuariosRepository;
        private readonly IS3Service _s3Service;

        public ArquivosMedicoesProjetoService(IMapper mapper, ILoggerFactory loggerFactory,
            IArquivosMedicoesProjetoRepository arquivosMedicoesProjetoRepository, IApplicationUser applicationUser, 
            IUsuariosRepository usuariosRepository, IS3Service s3Service)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<ArquivosMedicoesProjetoService>();
            _arquivosMedicoesProjetoRepository = arquivosMedicoesProjetoRepository;
            _applicationUser = applicationUser;
            _usuariosRepository = usuariosRepository;
            _s3Service = s3Service;
        }

        public async Task<Result<ArquivosMedicoesProjetoDataResponse>> BuscarTodosAsync(BuscarArquivosMedicoesProjetoFilter filter, CancellationToken cancellationToken)
        {
            var empresaFound = await _arquivosMedicoesProjetoRepository.BuscarTodosAsync(filter, await this.GetUsuarioLogado(cancellationToken), cancellationToken);
            var mapped = _mapper.Map<List<ArquivosMedicoesProjetoResponse>>(empresaFound.Items);
            var result = new ArquivosMedicoesProjetoDataResponse
            {
                Data = mapped,
                TotalRegisters = empresaFound.TotalRegistros,
            };

            return Result<ArquivosMedicoesProjetoDataResponse>.Success(result);
        }

        private async Task<UsuariosEntidade?> GetUsuarioLogado(CancellationToken cancellationToken)
        {
            var _userId = _applicationUser.UserId;
            var _usuario = await this._usuariosRepository.BuscarPorIdAsync(_userId, cancellationToken);

            return (_usuario);
        }

        public async Task<Result<DeleteArquivoMedicaoProjetoResponse>> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var _arquivo = await _arquivosMedicoesProjetoRepository.BuscarPorIdAsync(id, cancellationToken);

                if (_arquivo is null)
                    return Result<DeleteArquivoMedicaoProjetoResponse>.Failure(new NoRecordsError(Compartilhado.MedicoesProjeto.ArquivoIdNaoEncontrado));

                //Apaga primeira o arquivo no bucket na aws
                await this._s3Service.ApagarLogo(_arquivo.ArquivoMedicao);

                _arquivo.Delete();
                await _arquivosMedicoesProjetoRepository.DeletarAsync(_arquivo, cancellationToken);

                var result = new DeleteArquivoMedicaoProjetoResponse { Mensagem = Compartilhado.Contratos.ContratoDeletado };

                return Result<DeleteArquivoMedicaoProjetoResponse>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return Result<DeleteArquivoMedicaoProjetoResponse>.Failure(new UnknownError(ex.Message));
            }
        }

        public async Task<MemoryStream> DownloadArquivoMedicao(int id, CancellationToken cancellationToken)
        {
            try
            {
                var _arquivo = await _arquivosMedicoesProjetoRepository.BuscarPorIdAsync(id, cancellationToken);
                var _nomeArquivo = this._s3Service.ExtractFileNameFromUrl(_arquivo.ArquivoMedicao);
                var _stream = await this._s3Service.DownloadFileFromS3Async(_nomeArquivo);

                return (_stream);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}