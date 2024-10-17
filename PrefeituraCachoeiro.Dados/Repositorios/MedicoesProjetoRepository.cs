using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class MedicoesProjetoRepository : IMedicoesProjetoRepository
    {
        private readonly ContextoDb _context;
        private readonly IMapper _mapper;
        private readonly IItemsMedicoesProjetoRepository _itemMedicoesProjetoRepository;
        private readonly IItemsContratoRepository _itemsContratoRepository;

        public MedicoesProjetoRepository(ContextoDb context, IMapper mapper,
            IItemsMedicoesProjetoRepository itemsMedicoesRepository,
            IItemsContratoRepository itemsContratoRepository)
        {
            _context = context;
            _mapper = mapper;
            _itemMedicoesProjetoRepository = itemsMedicoesRepository;
            _itemsContratoRepository = itemsContratoRepository;
        }

        public async Task<PaginatedEntity<MedicoesProjetoEntidade>> BuscarTodosAsync(MedicoesProjetoFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.MedicoesProjetoEntidade
                                .Include(i => i.Contratos).ThenInclude(i => i.Projeto)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i=> i.Quantidade)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.StatusMedicao)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .AsQueryable();

            query = query.Where(x => x.DataDelecao == null);
            query = query.Where(x => x.IdContrato == filter.IdContrato);

            if (filter.StatusMedicao.HasValue)
                query = query.Where(x => x.IdStatusMedicao == (int)filter.StatusMedicao.Value);

            if (filter.IdMedicaoAtual.HasValue)
                query = query.Where(x => x.IdMedicoesProjeto != filter.IdMedicaoAtual.Value);

            var itemsCount = await query.AsNoTracking().CountAsync();

            query = query.OrderBy(i => i.IdMedicoesProjeto)
                         .Skip((filter.Pagina - 1) * filter.ItemsPorPagina)
                         .Take(filter.ItemsPorPagina);

            var items = await query.AsNoTracking().ToListAsync();

            return new PaginatedEntity<MedicoesProjetoEntidade>
            {
                Items = items,
                TotalRegistros = itemsCount
            };
        }

        public async Task<MedicoesProjetoEntidade?> BuscarPorIdAsync(int idMedicoesProjeto, CancellationToken cancellationToken)
        {
            return await _context.MedicoesProjetoEntidade
                                .Include(i => i.Contratos).ThenInclude(i=> i.Projeto)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i=> i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Quantidade)
                                .Include(i => i.StatusMedicao)
                                .FirstOrDefaultAsync(x => x.IdMedicoesProjeto == idMedicoesProjeto && x.DataDelecao == null, cancellationToken);
        }

        public async Task<MedicoesProjetoEntidade> InserirAsync(MedicoesProjetoEntidade medicoesProjeto, CancellationToken cancellationToken)
        {
            await _context.MedicoesProjetoEntidade.AddAsync(medicoesProjeto, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return medicoesProjeto;
        }

        public async Task<MedicoesProjetoEntidade> AtualizarAsync(MedicoesProjetoEntidade medicoesProjeto, CancellationToken cancellationToken)
        {
            _context.MedicoesProjetoEntidade.Update(medicoesProjeto);
            await _context.SaveChangesAsync(cancellationToken);

            return medicoesProjeto;
        }
    }
}