using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class StatusMedicaoRepository: IStatusMedicaoRepository
    {
        private readonly ContextoDb _context;

        public StatusMedicaoRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<List<StatusMedicaoEntidade>> BuscarTodosAsync(CancellationToken cancellationToken)
        {
            return await _context.StatusMedicaoEntidade.ToListAsync(cancellationToken);
        }
    }
}