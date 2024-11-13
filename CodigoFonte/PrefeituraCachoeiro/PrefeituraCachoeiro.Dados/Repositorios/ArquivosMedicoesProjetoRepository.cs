using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ArquivosMedicoesProjetoRepository : IArquivosMedicoesProjetoRepository
    {
        private readonly ContextoDb _context;

        public ArquivosMedicoesProjetoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<ArquivosMedicoesProjetoEntidade>> BuscarTodosAsync(BuscarArquivosMedicoesProjetoFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.ArquivosMedicoesProjeto.Where(i => i.IdMedicoesProjeto == filter.IdMedicoesProjeto);

            query = query.Where(x => x.DataDelecao == null);

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query
                .OrderBy(i => i.Id)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<ArquivosMedicoesProjetoEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<ArquivosMedicoesProjetoEntidade> InserirAsync(ArquivosMedicoesProjetoEntidade arquivo, CancellationToken cancellationToken)
        {
            await _context.ArquivosMedicoesProjeto.AddAsync(arquivo, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return arquivo;
        }
    }
}