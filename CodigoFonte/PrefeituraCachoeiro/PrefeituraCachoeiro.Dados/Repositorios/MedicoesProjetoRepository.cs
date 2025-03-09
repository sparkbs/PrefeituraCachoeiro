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

        public MedicoesProjetoRepository(ContextoDb context, IMapper mapper, IItemsMedicoesProjetoRepository itemsMedicoesRepository,
            IItemsContratoRepository itemsContratoRepository)
        {
            _context = context;
            _mapper = mapper;
            _itemMedicoesProjetoRepository = itemsMedicoesRepository;
            _itemsContratoRepository = itemsContratoRepository;
        }

        public async Task<List<MedicoesProjetoEntidade>> BuscarBoletimMedicaoAsync(int idMedicao, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken)
        {
            var query = _context.MedicoesProjetoEntidade
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Contratos).ThenInclude(i => i.Projetos)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item)
                                .Include(i => i.StatusMedicao)
                                .Include(i => i.Projeto)
                                .AsQueryable();

            query = query.Where(x => x.DataDelecao == null && x.IdMedicoesProjeto == idMedicao);
            query = query.OrderBy(i => i.IdMedicoesProjeto);

            //Verifica se o usuário logado tem prefeitura especificada
            if (usuarioLogado.PrefeituraId.HasValue)
                query = query.Where(i => i.Contratos.PrefeituraId == usuarioLogado.PrefeituraId);

            return (await query.ToListAsync());
        }

        public async Task<List<MedicoesProjetoEntidade>> BuscarBoletimMedicaoDetalhadoAsync(int idMedicao, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken)
        {
            var query = _context.MedicoesProjetoEntidade
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Contratos).ThenInclude(i => i.Projetos)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item)
                                .Include(i => i.StatusMedicao)
                                .Include(i => i.Projeto)
                                .AsQueryable();

            query = query.Where(x => x.DataDelecao == null && x.IdMedicoesProjeto == idMedicao);
            query = query.OrderBy(i => i.IdMedicoesProjeto);

            //Verifica se o usuário logado tem prefeitura especificada
            if (usuarioLogado.PrefeituraId.HasValue)
                query = query.Where(i => i.Contratos.PrefeituraId == usuarioLogado.PrefeituraId);

            return (await query.ToListAsync());
        }

        public async Task<List<MedicoesProjetoEntidade>> BuscarBoletimProjetoAsync(int idMedicao, int idProjeto, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken)
        {
            var query = _context.MedicoesProjetoEntidade
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Contratos).ThenInclude(i => i.Projetos)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item)
                                .Include(i => i.StatusMedicao)
                                .Include(i => i.Projeto)
                                .AsQueryable();

            query = query.Where(x => x.DataDelecao == null && x.IdMedicoesProjeto == idMedicao && x.IdProjeto == idProjeto);
            query = query.OrderBy(i => i.IdMedicoesProjeto);

            //Verifica se o usuário logado tem prefeitura especificada
            if (usuarioLogado.PrefeituraId.HasValue)
                query = query.Where(i => i.Contratos.PrefeituraId == usuarioLogado.PrefeituraId);

            return (await query.ToListAsync());
        }

        public async Task<PaginatedEntity<MedicoesProjetoEntidade>> BuscarTodosAsync(MedicoesProjetoFilter filter, UsuariosEntidade? usuarioLogado,
            CancellationToken cancellationToken)
        {
            var query = _context.MedicoesProjetoEntidade
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Contratos).ThenInclude(i => i.Projetos).ThenInclude(i => i.Projetos)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Quantidade)
                                .Include(i => i.StatusMedicao)
                                .Include(i => i.ArquivosMedicoesProjeto)
                                .AsQueryable();

            query = query.Where(x => x.DataDelecao == null);

            if (filter.IdProjeto.HasValue)
                query = query.Where(x => x.IdProjeto == filter.IdProjeto);

            if (filter.IdContrato.HasValue)
                query = query.Where(x => x.IdContrato == filter.IdContrato);

            if (filter.StatusMedicao.HasValue)
                query = query.Where(x => x.IdStatusMedicao == (int)filter.StatusMedicao.Value);

            if (filter.IdMedicaoAtual.HasValue)
                query = query.Where(x => x.IdMedicoesProjeto != filter.IdMedicaoAtual.Value);

            //Verifica se o usuário logado tem prefeitura especificada
            if (usuarioLogado.PrefeituraId.HasValue)
                query = query.Where(i => i.Contratos.PrefeituraId == usuarioLogado.PrefeituraId);

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

        public async Task<MedicoesProjetoEntidade?> BuscarPorIdAsync(int idMedicoesProjeto, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken)
        {
            //Verifica se o usuário logado tem prefeitura especificada
            if (usuarioLogado.PrefeituraId.HasValue)
                return await _context.MedicoesProjetoEntidade
                                .Include(i => i.Items)
                                .Include(i => i.Projeto)
                                .Include(i => i.Contratos).ThenInclude(i => i.Projetos).ThenInclude(i => i.Projetos)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Quantidade)
                                .Include(i => i.StatusMedicao)
                                .Include(i => i.ArquivosMedicoesProjeto)
                                .FirstOrDefaultAsync(x => x.IdMedicoesProjeto == idMedicoesProjeto &&
                                                          x.DataDelecao == null &&
                                                          x.Contratos.PrefeituraId == usuarioLogado.PrefeituraId, cancellationToken);
            else
                return await _context.MedicoesProjetoEntidade
                                .Include(i => i.Items)
                                .Include(i => i.Projeto)
                                .Include(i => i.Contratos).ThenInclude(i => i.Projetos).ThenInclude(i => i.Projetos)
                                .Include(i => i.Contratos).ThenInclude(i => i.Items).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Quantidade)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Item).ThenInclude(i => i.Origem)
                                .Include(i => i.Items).ThenInclude(i => i.ItemsContrato).ThenInclude(i => i.Quantidade)
                                .Include(i => i.StatusMedicao)
                                .Include(i => i.ArquivosMedicoesProjeto)
                                .FirstOrDefaultAsync(x => x.IdMedicoesProjeto == idMedicoesProjeto &&
                                                          x.DataDelecao == null, cancellationToken);
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

        public async Task<MedicoesProjetoEntidade?> BuscarUltimaMedicaoPorContratoIdAsync(int idContrato, UsuariosEntidade? usuarioLogado,
            CancellationToken cancellationToken)
        {
            var query = _context.MedicoesProjetoEntidade.AsQueryable();

            query = query.Where(x => x.IdContrato == idContrato && x.DataDelecao == null);

            //Verifica se o usuário logado tem prefeitura especificada
            if (usuarioLogado.PrefeituraId.HasValue)
                query = query.Where(i => i.Contratos.PrefeituraId == usuarioLogado.PrefeituraId);

            query = query.OrderByDescending(i => i.IdMedicoesProjeto);

            return (await query.FirstOrDefaultAsync());
        }
    }
}