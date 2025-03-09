using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ItemsContratoRepository: IItemsContratoRepository
    {
        private readonly ContextoDb _context;

        public ItemsContratoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<ItemsContratoEntidade?> BuscarPorIdAsync(int idItemContrato, CancellationToken cancellationToken)
        {
            var query = _context.ItemsContratoEntidade.Where(x => x.DataDelecao == null)
                                                      .Include(x => x.Quantidade);

            return await query.Where(x => x.IdItemContrato == idItemContrato).SingleOrDefaultAsync(cancellationToken);
        }

        public async Task<ItemsContratoEntidade> InserirAsync(ItemsContratoEntidade items, CancellationToken cancellationToken)
        {
            await _context.ItemsContratoEntidade.AddAsync(items, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return items;
        }

        public async Task<List<ItemsContratoEntidade>> BuscarTodosItemsContratosAsync(int idContrato, CancellationToken cancellationToken)
        {
            var query = await _context.ItemsContratoEntidade.Where(x => x.DataDelecao == null && x.ContratosId == idContrato)
                                                            .Include(x => x.Item)
                                                            .Include(x => x.Quantidade)
                                                            .ToListAsync();

            return (query);
        }

        public async Task<ItemsContratoEntidade> AtualizarAsync(ItemsContratoEntidade item, CancellationToken cancellationToken)
        {
            _context.ItemsContratoEntidade.Update(item);
            await _context.SaveChangesAsync(cancellationToken);

            return item;
        }
    }
}