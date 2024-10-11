using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ContratosRepository: IContratosRepository
    {
        private readonly ContextoDb _context;

        public ContratosRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<ContratosEntidade>> BuscarTodosAsync(ContratosFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.ContratosEntidade
                                .Include(i => i.Projeto)
                                .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.Quantidade).AsQueryable();

            query = query.Where(x => x.DataDelecao == null);

            if (filter.IdProjeto.HasValue)
                query = query.Where(x => x.IdProjeto == filter.IdProjeto);

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query
                .OrderBy(i => i.IdProjeto)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<ContratosEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<ContratosEntidade?> BuscarPorIdAsync(int idContrato, CancellationToken cancellationToken)
        {
            return await _context.ContratosEntidade
                                 .Include(i=> i.Projeto)
                                 .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                 .Include(i=> i.Items).ThenInclude(i=> i.Quantidade)
                                 .FirstOrDefaultAsync(x => x.IdContrato == idContrato && x.DataDelecao == null, cancellationToken);
        }

        public async Task<ContratosEntidade?> BuscarPorIdProjetoAsync(int idProjeto, CancellationToken cancellationToken)
        {
            return await _context.ContratosEntidade
                                 .Include(i => i.Projeto)
                                 .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                 .Include(i => i.Items).ThenInclude(i => i.Quantidade)
                                 .FirstOrDefaultAsync(x => x.IdProjeto == idProjeto && x.DataDelecao == null, cancellationToken);
        }

        public async Task<ContratosEntidade> InserirAsync(ContratosEntidade contrato, CancellationToken cancellationToken)
        {
            await _context.ContratosEntidade.AddAsync(contrato, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return contrato;
        }

        public async Task<ContratosEntidade> AtualizarAsync(ContratosEntidade contrato, CancellationToken cancellationToken)
        {
            _context.ContratosEntidade.Update(contrato);
            await _context.SaveChangesAsync(cancellationToken);

            return contrato;
        }

        public async Task<ContratosEntidade> DeletarAsync(ContratosEntidade contrato, CancellationToken cancellationToken)
        {
            _context.ContratosEntidade.Update(contrato);
            await _context.SaveChangesAsync(cancellationToken);

            return contrato;
        }
    }
}