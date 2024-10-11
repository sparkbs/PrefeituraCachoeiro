using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class TiposPermissoesRepository: ITiposPermissoesRepository
    {
        private readonly ContextoDb _context;

        public TiposPermissoesRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<List<TipoPermissoesEntidade>> BuscarTodosAsync(CancellationToken cancellationToken)
        {
            return await _context.TipoPermissoesEntidade.Where(x => x.DataDelecao == null)
                                                        .AsNoTracking()
                                                        .OrderBy(i=> i.Nome)
                                                        .ToListAsync();
        }
    }
}