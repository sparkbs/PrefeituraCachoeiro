using AutoMapper;
using Microsoft.Extensions.Logging;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class TiposPermissoesService : ITiposPermissoesService
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly ITiposPermissoesRepository _tiposPermissoesRepository;

        public TiposPermissoesService(IMapper mapper, ILoggerFactory loggerFactory, ITiposPermissoesRepository tiposPermissoesRepository)
        {
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<TiposPermissoesService>();
            _tiposPermissoesRepository = tiposPermissoesRepository;
        }

        public async Task<Result<List<TiposPermissoesResponse>>> BuscarTodosAsync(CancellationToken cancellationToken)
        {
            var tipos = await _tiposPermissoesRepository.BuscarTodosAsync(cancellationToken);
            var mapped = _mapper.Map<List<TiposPermissoesResponse>>(tipos);

            return Result<List<TiposPermissoesResponse>>.Success(mapped);
        }
    }
}