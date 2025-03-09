using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ItemsAditivoRepository : IItemsAditivoRepository
    {
        private readonly ContextoDb _context;

        public ItemsAditivoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<ItemsAditivoEntidade> InserirAsync(ItemsAditivoEntidade items, CancellationToken cancellationToken)
        {
            await _context.ItemsAditivoEntidade.AddAsync(items, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return items;
        }

        public async Task<List<ItemsAditivoEntidade>> BuscarTodosItemsAditivosAsync(int idAditivo, CancellationToken cancellationToken)
        {
            return (await _context.ItemsAditivoEntidade
                                  .Include(i=> i.Item)
                                  .Where(x => x.AditivoId == idAditivo && x.DataDelecao == null).ToListAsync());
        }
    }
}