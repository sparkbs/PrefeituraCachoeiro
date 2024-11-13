using AutoMapper;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class ArquivosMedicoesProjetoService : IArquivosMedicoesProjetoService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IArquivosMedicoesProjetoRepository _arquivosMedicoesProjetoRepository;

        public ArquivosMedicoesProjetoService(IMapper mapper, ILoggerFactory loggerFactory,IArquivosMedicoesProjetoRepository arquivosMedicoesProjetoRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<ArquivosMedicoesProjetoService>();
            _arquivosMedicoesProjetoRepository = arquivosMedicoesProjetoRepository;
        }

        public async Task<Result<ArquivosMedicoesProjetoDataResponse>> BuscarTodosAsync(BuscarArquivosMedicoesProjetoFilter filter, CancellationToken cancellationToken)
        {
            var empresaFound = await _arquivosMedicoesProjetoRepository.BuscarTodosAsync(filter, cancellationToken);
            var mapped = _mapper.Map<List<ArquivosMedicoesProjetoResponse>>(empresaFound.Items);
            var result = new ArquivosMedicoesProjetoDataResponse
            {
                Data = mapped,
                TotalRegisters = empresaFound.TotalRegistros,
            };

            return Result<ArquivosMedicoesProjetoDataResponse>.Success(result);
        }
    }
}