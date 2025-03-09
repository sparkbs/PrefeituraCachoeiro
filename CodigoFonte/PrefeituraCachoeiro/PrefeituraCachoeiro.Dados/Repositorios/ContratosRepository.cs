using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ContratosRepository : IContratosRepository
    {
        private readonly ContextoDb _context;

        public ContratosRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PaginatedEntity<ContratosEntidade>> BuscarTodosAsync(ContratosFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.ContratosEntidade
                                .Include(i => i.Projetos).ThenInclude(i=> i.Projetos)
                                .Include(i => i.Prefeitura)
                                .Include(i => i.Empresa)
                                .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.Quantidade)
                                .Include(i => i.ArquivosContratos).AsQueryable();

            query = query.Where(x => x.DataDelecao == null);

            var _listaParcial = await query.ToListAsync();
            var _listaFinal = new List<ContratosEntidade>();

            if (filter.IdProjeto.HasValue)
            {
                foreach (var _itemParcial in _listaParcial)
                {
                    var _projetos = _itemParcial.Projetos.Where(i => i.IdProjeto == filter.IdProjeto).ToList();

                    if (_projetos.Count() > 0)
                        _listaFinal.Add(_itemParcial);
                }
            }
            else
                _listaFinal.AddRange(_listaParcial);

            var itemsCount = _listaFinal.Count();

            _listaFinal = _listaFinal
                .OrderBy(i => i.IdContrato)
                .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                .Take(filter.ItemsPorPagina)
                .ToList();

            var items = _listaFinal;

            return new PaginatedEntity<ContratosEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<ContratosEntidade?> BuscarPorIdAsync(int idContrato, CancellationToken cancellationToken)
        {
            return await _context.ContratosEntidade
                                 .Include(i => i.Projetos).ThenInclude(i=> i.Projetos)
                                 .Include(i => i.Prefeitura)
                                 .Include(i => i.Empresa)
                                 .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                 .Include(i => i.Items).ThenInclude(i => i.Quantidade)
                                 .Include(i => i.ArquivosContratos)
                                 .FirstOrDefaultAsync(x => x.IdContrato == idContrato && x.DataDelecao == null, cancellationToken);
        }

        public async Task<List<ContratosEntidade>> BuscarTodosAditivosAsync(int idContrato, CancellationToken cancellationToken)
        {
            var query = _context.ContratosEntidade
                                .Include(i => i.Projetos).ThenInclude(i => i.Projetos)
                                .Include(i => i.Prefeitura)
                                .Include(i => i.Empresa)
                                .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.Quantidade)
                                .Include(i => i.ArquivosContratos).AsQueryable();

            query = query.Where(x => x.DataDelecao == null && x.Aditivo == idContrato);

            var _listaParcial = await query.ToListAsync();

            return (_listaParcial);
        }

        public async Task<ContratosEntidade?> BuscarPorIdProjetoAsync(int idProjeto, CancellationToken cancellationToken)
        {
            return await _context.ContratosEntidade
                                 .Include(i => i.Projetos).ThenInclude(i=> i.Projetos)
                                 .Include(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                 .Include(i => i.Items).ThenInclude(i => i.Quantidade)
                                 .Include(i => i.ArquivosContratos)
                                 .FirstOrDefaultAsync(x => x.Projetos.Any(i=> i.IdProjeto == idProjeto) && x.DataDelecao == null, cancellationToken);
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

        public async Task AdicionarProjetoContratoAsync(ContratosProjetosEntidade projeto, CancellationToken cancellationToken)
        {
            _context.ContratosProjetos.Add(projeto);
            await _context.SaveChangesAsync();
        }

        public async Task RemoverProjetoContratoAsync(ContratosProjetosEntidade projeto, CancellationToken cancellationToken)
        {
            _context.ContratosProjetos.Remove(projeto);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> VerificarProjetoAssociadoContratoAsync(int idContrato, int idProjeto, CancellationToken cancellationToken)
        {
            return (await _context.ContratosProjetos.Where(i => i.IdContrato == idContrato && i.IdProjeto == idProjeto).AnyAsync());
        }

        public async Task<ContratosProjetosEntidade?> BuscarProjetoInContratoAsync(int idContrato, int idProjeto, CancellationToken cancellationToken)
        {
            return (await _context.ContratosProjetos.Where(i => i.IdContrato == idContrato && i.IdProjeto == idProjeto).FirstOrDefaultAsync());
        }
    }
}