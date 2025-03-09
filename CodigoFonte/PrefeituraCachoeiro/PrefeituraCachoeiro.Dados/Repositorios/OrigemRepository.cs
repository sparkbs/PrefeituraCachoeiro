using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class OrigemRepository : IOrigemRepository
    {
        private readonly ContextoDb _context;

        public OrigemRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<OrigemEntidade?> BuscarPorNomeAsync(string nome, CancellationToken cancellationToken)
        {
            return await _context.OrigemEntidade.AsNoTracking().FirstOrDefaultAsync(x => x.Nome.ToUpper().Trim() == nome.ToUpper().Trim(), cancellationToken);
        }

        public async Task<OrigemEntidade?> BuscarPorIdAsync(int idOrigem, CancellationToken cancellationToken)
        {
            return await _context.OrigemEntidade.AsNoTracking()
                                 .FirstOrDefaultAsync(x => x.IdOrigem == idOrigem && x.DataDelecao == null, cancellationToken);
        }

        public async Task<int> CriarNovoId(CancellationToken cancellationToken)
        {
            var _ultimoValor = await _context.OrigemEntidade.MaxAsync(i => i.IdOrigem, cancellationToken);

            _ultimoValor++;

            return (_ultimoValor);
        }

        public async Task<OrigemEntidade> InserirAsync(OrigemEntidade origem, CancellationToken cancellationToken)
        {
            await _context.OrigemEntidade.AddAsync(origem, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return origem;
        }
    }
}