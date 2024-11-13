using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class EmpresaRepository: IEmpresaRepository
    {
        private readonly ContextoDb _context;

        public EmpresaRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<EmpresaEntidade>> BuscarTodosAsync(EmpresaFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.EmpresaEntidade.Where(x => x.DataDelecao == null).AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Nome))
                query = query.Where(x => x.Nome.Contains(filter.Nome));

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query
                .OrderBy(i => i.EmpresaId)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<EmpresaEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<EmpresaEntidade?> BuscarPorIdAsync(int idEmpresa, CancellationToken cancellationToken)
        {
            return await _context.EmpresaEntidade
                                 .FirstOrDefaultAsync(x => x.EmpresaId == idEmpresa && x.DataDelecao == null, cancellationToken);
        }

        public async Task<EmpresaEntidade> InserirAsync(EmpresaEntidade empresa, CancellationToken cancellationToken)
        {
            await _context.EmpresaEntidade.AddAsync(empresa, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return empresa;
        }

        public async Task<EmpresaEntidade> AtualizarAsync(EmpresaEntidade empresa, CancellationToken cancellationToken)
        {
            _context.EmpresaEntidade.Update(empresa);
            await _context.SaveChangesAsync(cancellationToken);

            return empresa;
        }

        public async Task<EmpresaEntidade> DeletarAsync(EmpresaEntidade empresa, CancellationToken cancellationToken)
        {
            _context.EmpresaEntidade.Update(empresa);
            await _context.SaveChangesAsync(cancellationToken);

            return empresa;
        }
    }
}