using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class PermissoesRepository: IPermissoesRepository
    {
        private readonly ContextoDb _context;

        public PermissoesRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<PermissoesEntidade> InserirAsync(PermissoesEntidade permissao, CancellationToken cancellationToken)
        {
            await _context.PermissoesEntidade.AddAsync(permissao, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return permissao;
        }

        public async Task<PermissoesEntidade> DeletarAsync(PermissoesEntidade permissao, CancellationToken cancellationToken)
        {
            _context.PermissoesEntidade.Update(permissao);
            await _context.SaveChangesAsync(cancellationToken);

            return permissao;
        }

        public async Task<PermissoesEntidade?> BuscarPermissaoGruposAsync(int grupoId, int tipoPermissaoId, CancellationToken cancellationToken)
        {
            return await _context.PermissoesEntidade
                .Where(i => i.IdGrupo == grupoId && i.IdTipoPermissao == tipoPermissaoId & i.DataDelecao == null)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<List<TipoPermissoesEntidade>> BuscarPermissoesPorGrupoIdAsync(int grupoId, CancellationToken cancellationToken)
        {
            return await _context.PermissoesEntidade
                .Include(i => i.TipoPermissao)
                .Where(i => i.IdGrupo == grupoId && i.DataDelecao == null)
                .AsNoTracking()
                .Select(i => i.TipoPermissao).ToListAsync();
        }
    }
}