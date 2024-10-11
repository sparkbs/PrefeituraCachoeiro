using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class UsuariosGruposRepository : IUsuariosGruposRepository
    {
        private readonly ContextoDb _context;
        private readonly IGruposRepository _gruposRepository;

        public UsuariosGruposRepository(ContextoDb context, IGruposRepository gruposRepository)
        {
            _context = context;
            _gruposRepository = gruposRepository;
        }

        public async Task<UsuariosGruposEntidade> InserirAsync(UsuariosGruposEntidade grupo, CancellationToken cancellationToken)
        {
            await _context.UsuariosGruposEntidade.AddAsync(grupo, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return grupo;
        }

        public async Task<UsuariosGruposEntidade> DeletarAsync(UsuariosGruposEntidade grupo, CancellationToken cancellationToken)
        {
            _context.UsuariosGruposEntidade.Update(grupo);
            await _context.SaveChangesAsync(cancellationToken);

            return grupo;
        }

        public async Task<UsuariosGruposEntidade?> BuscarUsuarioGruposAsync(int usuarioId, int grupoId, CancellationToken cancellationToken)
        {
            return await _context.UsuariosGruposEntidade
                .Where(i => i.IdUsuario == usuarioId && i.IdGrupo == grupoId & i.DataDelecao == null)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<List<GruposEntidade>> BuscarGruposPorUsuarioIdAsync(int usuarioId, CancellationToken cancellationToken)
        {
            return await _context.UsuariosGruposEntidade
                .Include(i => i.Grupo)
                .Where(i => i.IdUsuario == usuarioId && i.DataDelecao == null)
                .AsNoTracking()
                .Select(i => i.Grupo).ToListAsync();
        }

        public async Task<List<GruposEntidade>> BuscarGruposDisponiveisPorUsuarioIdAsync(int usuarioId, CancellationToken cancellationToken)
        {
            var _gruposFilter = new GruposFilter();
            var _listaGrupos = await this._gruposRepository.BuscarTodosAsync(_gruposFilter, cancellationToken);
            var _listaGruposAtuais = await this.BuscarGruposPorUsuarioIdAsync(usuarioId, cancellationToken);
            var _listaGruposDisponiveis = new List<GruposEntidade>();

            foreach (var _grupo in _listaGrupos.Items)
            {
                if (!_listaGruposAtuais.Any(i => i.IdGrupo == _grupo.IdGrupo))
                    _listaGruposDisponiveis.Add(_grupo);
            }

            return (_listaGruposDisponiveis);
        }
    }
}