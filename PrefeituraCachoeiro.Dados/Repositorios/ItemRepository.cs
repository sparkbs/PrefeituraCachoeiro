using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ItemRepository: IItemRepository
    {
        private readonly ContextoDb _context;

        public ItemRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<List<ItemEntidade>> BuscarTodosAsync(CancellationToken cancellationToken)
        {
            return await _context.ItemEntidade
                                 .Include(i=> i.Quantidade)
                                 .AsQueryable()
                                 .Where(x => x.DataDelecao == null)
                                 .OrderBy(i=> i.Ordem)
                                 .AsNoTracking()
                                 .ToListAsync();
        }
    }
}