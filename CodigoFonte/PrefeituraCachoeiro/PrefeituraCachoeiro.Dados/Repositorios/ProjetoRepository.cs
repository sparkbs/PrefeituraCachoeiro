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
            var query = _context.ProjetoEntidade
                                 .Include(i => i.Contratos).ThenInclude(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item)
                                 .AsQueryable();

            query = query.Where(x => x.DataDelecao == null);

            if (!string.IsNullOrWhiteSpace(filter.Nome))
                query = query.Where(x => x.NomeProjeto.ToUpper().Contains(filter.Nome.ToUpper()));

            //Verifica se foi informado o id do contrato
            if (filter.IdContrato.HasValue)
                query = query.Where(x => x.Contratos.Any(i=> i.IdContrato == filter.IdContrato));

            var itemsCount = await query.CountAsync();

            query = query
                .OrderBy(i => i.IdProjeto)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina);

            var items = await query.ToListAsync();

            return new PaginatedEntity<ProjetoEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<ProjetoEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.ProjetoEntidade
                                 .Include(i=> i.Contratos).ThenInclude(i=> i.Contratos)
                                 .Include(i => i.Contratos).ThenInclude(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i=> i.Item).ThenInclude(i=> i.Origem)
                                 .Include(i => i.Contratos).ThenInclude(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                 .Include(i => i.Contratos).ThenInclude(i => i.Contratos).ThenInclude(i => i.Prefeitura)
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

        public async Task<ProjetoEntidade?> BuscarPorCodigoProjetoAsync(int codigoProjeto, CancellationToken cancellationToken)
        {
            return await _context.ProjetoEntidade
                                 .FirstOrDefaultAsync(x => x.CodigoProjeto == codigoProjeto && x.DataDelecao == null, cancellationToken);
        }

        public async Task<ProjetoEntidade?> BuscarPorCodigoProjetoAndIdPrefeituraAsync(int codigoProjeto, int idPrefeitura, CancellationToken cancellationToken)
        {
            return await _context.ProjetoEntidade
                                 .FirstOrDefaultAsync(x => x.CodigoProjeto == codigoProjeto & x.IdPrefeitura == idPrefeitura && x.DataDelecao == null, cancellationToken);
        }

        public async Task<ProjetoEntidade?> BuscarPorCodigoProjetoAsync(int codigoProjeto, int idProjeto, CancellationToken cancellationToken)
        {
            return await _context.ProjetoEntidade
                                 .FirstOrDefaultAsync(x => x.CodigoProjeto == codigoProjeto && x.IdProjeto != idProjeto && x.DataDelecao == null, cancellationToken);
        }

        public async Task<ProjetoEntidade?> BuscarPorCodigoProjetoAndIdPrefeituraAsync(int codigoProjeto, int idProjeto, 
            int idPrefeituraAtual, CancellationToken cancellationToken)
        {
            return await _context.ProjetoEntidade
                                 .FirstOrDefaultAsync(x => x.CodigoProjeto == codigoProjeto && 
                                                           x.IdProjeto != idProjeto &&
                                                           x.IdPrefeitura == idPrefeituraAtual &&
                                                           x.DataDelecao == null, cancellationToken);
        }
    }
}