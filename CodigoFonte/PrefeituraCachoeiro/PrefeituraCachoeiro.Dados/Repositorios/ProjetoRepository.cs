using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ProjetoRepository: IProjetoRepository
    {
        private readonly ContextoDb _context;

        public ProjetoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<ProjetoEntidade>> BuscarTodosAsync(ProjetosFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.ProjetoEntidade.AsQueryable();

            query = query.Where(x => x.DataDelecao == null);

            if (!string.IsNullOrWhiteSpace(filter.Nome))
                query = query.Where(x => x.NomeProjeto.ToUpper().Contains(filter.Nome.ToUpper()));

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query
                .OrderBy(i => i.IdProjeto)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<ProjetoEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<ProjetoEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.ProjetoEntidade
                .Include(i=> i.Contratos)
                .FirstOrDefaultAsync(x => x.IdProjeto == id && x.DataDelecao == null, cancellationToken);
        }

        public async Task<ProjetoEntidade> InserirAsync(ProjetoEntidade projeto, CancellationToken cancellationToken)
        {
            await _context.ProjetoEntidade.AddAsync(projeto, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return projeto;
        }

        public async Task<ProjetoEntidade> AtualizarAsync(ProjetoEntidade projeto, CancellationToken cancellationToken)
        {
            _context.ProjetoEntidade.Update(projeto);
            await _context.SaveChangesAsync(cancellationToken);

            return projeto;
        }

        public async Task<ProjetoEntidade> DeletarAsync(ProjetoEntidade projeto, CancellationToken cancellationToken)
        {
            _context.ProjetoEntidade.Update(projeto);
            await _context.SaveChangesAsync(cancellationToken);

            return projeto;
        }
    }
}