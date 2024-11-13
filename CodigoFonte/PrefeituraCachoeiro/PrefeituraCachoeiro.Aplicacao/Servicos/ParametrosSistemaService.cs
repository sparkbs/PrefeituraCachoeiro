using AutoMapper;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Errors;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class ParametrosSistemaService : IParametrosSistemaService
    {
        private const string QUANTIDADE_M = @"M";
        private const string QUANTIDADE_M2 = @"M2";
        private const string QUANTIDADE_KM = @"KM";

        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IParametrosSistemaRepository _parametrosSistemaRepository;

        public ParametrosSistemaService(IMapper mapper, ILoggerFactory loggerFactory, IParametrosSistemaRepository parametrosSistemaRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<ParametrosSistemaService>();
            _parametrosSistemaRepository = parametrosSistemaRepository;
        }

        public async Task<Result<ParametrosSistemaResponse>> BuscarPorIdAsync(CancellationToken cancellationToken)
        {
            var parametros = await _parametrosSistemaRepository.BuscarUnicoRegistro(cancellationToken);

            if (parametros is null)
                return Result<ParametrosSistemaResponse>.Failure(new NoRecordsError(Compartilhado.ParametrosSistema.ParametrosSistemaNaoEncontrrados));

            var result = _mapper.Map<ParametrosSistemaResponse>(parametros);
            return Result<ParametrosSistemaResponse>.Success(result);
        }
    }
}