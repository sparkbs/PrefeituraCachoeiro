using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class QuantidadeRepository : IQuantidadeRepository
    {
        private readonly ContextoDb _context;

        public QuantidadeRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<QuantidadeEntidade?> BuscarPorNomeAsync(string nome, CancellationToken cancellationToken)
        {
            return await _context.QuantidadeEntidade.AsNoTracking().FirstOrDefaultAsync(x => x.Nome.ToUpper().Trim() == nome.ToUpper().Trim(), cancellationToken);
        }

        public async Task<QuantidadeEntidade?> BuscarPorIdAsync(int idQuantidade, CancellationToken cancellationToken)
        {
            return await _context.QuantidadeEntidade
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(x => x.IdQuantidade == idQuantidade && x.DataDelecao == null, cancellationToken);
        }

        public async Task<QuantidadeEntidade> InserirAsync(QuantidadeEntidade quantidade, CancellationToken cancellationToken)
        {
            await _context.QuantidadeEntidade.AddAsync(quantidade, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return quantidade;
        }

        public async Task<int> CriarNovoId(CancellationToken cancellationToken)
        {
            var _ultimoValor = await _context.QuantidadeEntidade.MaxAsync(i => i.IdQuantidade, cancellationToken);

            _ultimoValor++;

            return (_ultimoValor);
        }
    }
}