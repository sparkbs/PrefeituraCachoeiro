using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ArquivosAditivoRepository : IArquivosAditivoRepository
    {
        private readonly ContextoDb _context;

        public ArquivosAditivoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<ArquivosAditivoEntidade> InserirAsync(ArquivosAditivoEntidade arquivos, CancellationToken cancellationToken)
        {
            await _context.ArquivosAditivos.AddAsync(arquivos, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return arquivos;
        }

        public async Task DeletarAsync(ArquivosAditivoEntidade arquivo, CancellationToken cancellationToken)
        {
            _context.ArquivosAditivos.Remove(arquivo);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<ArquivosAditivoEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.ArquivosAditivos.FirstOrDefaultAsync(x => x.Id == id && x.DataDelecao == null, cancellationToken);
        }
    }
}