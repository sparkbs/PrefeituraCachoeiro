using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class AditivosRepository : IAditivosRepository
    {
        private readonly ContextoDb _context;

        public AditivosRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<AditivosEntidade> InserirAsync(AditivosEntidade aditivo, CancellationToken cancellationToken)
        {
            await _context.Aditivos.AddAsync(aditivo, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return aditivo;
        }

        public async Task<List<AditivosEntidade>> BuscarTodosAsync(int idContrato, CancellationToken cancellationToken)
        {
            return await _context.Aditivos
                                 .Include(i=> i.Items)
                                 .Include(i=> i.ArquivosAditivos)
                                 .Where(i => i.ContratoId == idContrato && i.DataDelecao == null)
                                 .OrderByDescending(i=> i.IdAditivo)
                                 .ToListAsync();
        }

        public async Task<AditivosEntidade?> BuscarPorIdAsync(int idAditivo, CancellationToken cancellationToken)
        {
            return await _context.Aditivos
                                 .Include(i=> i.Items)
                                 .Include(i=> i.ArquivosAditivos)
                                 .FirstOrDefaultAsync(x => x.IdAditivo == idAditivo && x.DataDelecao == null, cancellationToken);
        }

        public async Task<AditivosEntidade> DeletarAsync(AditivosEntidade aditivo, CancellationToken cancellationToken)
        {
            _context.Aditivos.Update(aditivo);
            await _context.SaveChangesAsync(cancellationToken);

            return aditivo;
        }
    }
}