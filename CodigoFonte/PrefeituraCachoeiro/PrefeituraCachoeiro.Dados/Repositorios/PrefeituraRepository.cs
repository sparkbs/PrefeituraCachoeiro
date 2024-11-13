using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class PrefeituraRepository : IPrefeituraRepository
    {
        private readonly ContextoDb _context;

        public PrefeituraRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<PrefeituraEntidade>> BuscarTodosAsync(PrefeituraFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.PrefeituraEntidade.Where(x => x.DataDelecao == null).AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Nome))
                query = query.Where(x => x.Nome.Contains(filter.Nome));

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query
                .OrderBy(i => i.IdPrefeitura)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<PrefeituraEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<PrefeituraEntidade?> BuscarPorIdAsync(int idPrefeitura, CancellationToken cancellationToken)
        {
            return await _context.PrefeituraEntidade
                                 .FirstOrDefaultAsync(x => x.IdPrefeitura == idPrefeitura && x.DataDelecao == null, cancellationToken);
        }

        public async Task<PrefeituraEntidade> InserirAsync(PrefeituraEntidade prefeitura, CancellationToken cancellationToken)
        {
            await _context.PrefeituraEntidade.AddAsync(prefeitura, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return prefeitura;
        }

        public async Task<PrefeituraEntidade> AtualizarAsync(PrefeituraEntidade prefeitura, CancellationToken cancellationToken)
        {
            _context.PrefeituraEntidade.Update(prefeitura);
            await _context.SaveChangesAsync(cancellationToken);

            return prefeitura;
        }

        public async Task<PrefeituraEntidade> DeletarAsync(PrefeituraEntidade prefeitura, CancellationToken cancellationToken)
        {
            _context.PrefeituraEntidade.Update(prefeitura);
            await _context.SaveChangesAsync(cancellationToken);

            return prefeitura;
        }
    }
}