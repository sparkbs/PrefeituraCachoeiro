using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ArquivosContratoRepository : IArquivosContratoRepository
    {
        private readonly ContextoDb _context;

        public ArquivosContratoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<ArquivosContratosEntidade> InserirAsync(ArquivosContratosEntidade arquivos, CancellationToken cancellationToken)
        {
            await _context.ArquivosContratos.AddAsync(arquivos, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return arquivos;
        }

        public async Task DeletarAsync(ArquivosContratosEntidade arquivo, CancellationToken cancellationToken)
        {
            _context.ArquivosContratos.Remove(arquivo);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<ArquivosContratosEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.ArquivosContratos.FirstOrDefaultAsync(x => x.Id == id && x.DataDelecao == null, cancellationToken);
        }
    }
}