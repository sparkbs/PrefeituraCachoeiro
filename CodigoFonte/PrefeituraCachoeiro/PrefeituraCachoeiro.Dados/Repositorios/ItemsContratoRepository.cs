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
    }
}