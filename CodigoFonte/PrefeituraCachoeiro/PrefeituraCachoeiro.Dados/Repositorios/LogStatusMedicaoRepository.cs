using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class LogStatusMedicaoRepository: ILogStatusMedicaoRepository
    {
        private readonly ContextoDb _context;

        public LogStatusMedicaoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<LogStatusMedicaoEntidade>> BuscarTodosAsync(LogStatusMedicaoFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.LogStatusMedicaoEntidade
                                .Include(i => i.Usuario)
                                .Include(i => i.MedicoesProjeto).ThenInclude(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i=> i.Item)
                                .Include(i => i.MedicoesProjeto).ThenInclude(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i=> i.Quantidade)
                                .Include(i => i.StatusMedicao).AsQueryable();

            query = query.Where(x => x.DataDelecao == null);
            query = query.Where(x => x.IdMedicoesProjeto == filter.IdMedicoesProjeto);

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query
                .OrderBy(i => i.IdLogStatusMedicao)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<LogStatusMedicaoEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<LogStatusMedicaoEntidade?> BuscarPorIdAsync(int idLogStatusMedicao, CancellationToken cancellationToken)
        {
            return await _context.LogStatusMedicaoEntidade
                                .Include(i => i.Usuario)
                                .Include(i => i.MedicoesProjeto).ThenInclude(i => i.Items).ThenInclude(i => i.ItemsContrato)/*remover .ThenInclude(i => i.Item)*/
                                .Include(i => i.MedicoesProjeto).ThenInclude(i => i.Items).ThenInclude(i => i.ItemsContrato)/*remover .ThenInclude(i => i.Quantidade)*/
                                .Include(i => i.StatusMedicao)
                                .FirstOrDefaultAsync(x => x.IdLogStatusMedicao == idLogStatusMedicao && x.DataDelecao == null, cancellationToken);
        }

        public async Task<LogStatusMedicaoEntidade> InserirAsync(LogStatusMedicaoEntidade logStatusMedicaoProjeto, CancellationToken cancellationToken)
        {
            await _context.LogStatusMedicaoEntidade.AddAsync(logStatusMedicaoProjeto, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return logStatusMedicaoProjeto;
        }
    }
}