using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class GruposRepository : IGruposRepository
    {
        private readonly ContextoDb _context;

        public GruposRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<GruposEntidade>> BuscarTodosAsync(GruposFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.GruposEntidade.AsQueryable();

            query = query.Where(x => x.DataDelecao == null);

            if (!string.IsNullOrWhiteSpace(filter.Nome))
                query = query.Where(x => x.Nome.ToUpper().Contains(filter.Nome.ToUpper()));

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query
                .OrderBy(i => i.IdGrupo)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<GruposEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<GruposEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.GruposEntidade
                .Include(i => i.Permissoes)
                .FirstOrDefaultAsync(x => x.IdGrupo == id && x.DataDelecao == null, cancellationToken);
        }

        public async Task<GruposEntidade> InserirAsync(GruposEntidade grupo, CancellationToken cancellationToken)
        {
            await _context.GruposEntidade.AddAsync(grupo, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return grupo;
        }

        public async Task<GruposEntidade> AtualizarAsync(GruposEntidade grupo, CancellationToken cancellationToken)
        {
            _context.GruposEntidade.Update(grupo);
            await _context.SaveChangesAsync(cancellationToken);

            return grupo;
        }

        public async Task<GruposEntidade> DeletarAsync(GruposEntidade grupo, CancellationToken cancellationToken)
        {
            _context.GruposEntidade.Update(grupo);
            await _context.SaveChangesAsync(cancellationToken);

            return grupo;
        }
    }
}