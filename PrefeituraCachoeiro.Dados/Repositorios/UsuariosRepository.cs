using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class UsuariosRepository : IUsuariosRepository
    {
        private readonly ContextoDb _context;

        public UsuariosRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<UsuariosEntidade>> BuscarTodosAsync(UsuariosFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.UsuariosEntidade.AsQueryable();

            query = query.Where(x => x.DataDelecao == null);

            if (!string.IsNullOrWhiteSpace(filter.Nome))
                query = query.Where(x => x.Nome.ToUpper().Contains(filter.Nome.ToUpper()));

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query
                .OrderBy(i => i.IdUsuario)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<UsuariosEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<UsuariosEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.UsuariosEntidade
                .FirstOrDefaultAsync(x => x.IdUsuario == id && x.DataDelecao == null, cancellationToken);
        }

        public async Task<UsuariosEntidade?> BuscarPorLogingAsync(string login, CancellationToken cancellationToken)
        {
            return await _context.UsuariosEntidade
                .FirstOrDefaultAsync(x => x.Login == login && x.DataDelecao == null, cancellationToken);
        }

        public async Task<UsuariosEntidade> InserirAsync(UsuariosEntidade usuario, CancellationToken cancellationToken)
        {
            await _context.UsuariosEntidade.AddAsync(usuario, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return usuario;
        }

        public async Task<UsuariosEntidade> AtualizarAsync(UsuariosEntidade usuario, CancellationToken cancellationToken)
        {
            _context.UsuariosEntidade.Update(usuario);
            await _context.SaveChangesAsync(cancellationToken);

            return usuario;
        }

        public async Task<UsuariosEntidade> DeletarAsync(UsuariosEntidade usuario, CancellationToken cancellationToken)
        {
            _context.UsuariosEntidade.Update(usuario);
            await _context.SaveChangesAsync(cancellationToken);

            return usuario;
        }
    }
}