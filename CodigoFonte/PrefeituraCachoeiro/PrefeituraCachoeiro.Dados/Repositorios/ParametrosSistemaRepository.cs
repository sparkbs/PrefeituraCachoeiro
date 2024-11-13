using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class ParametrosSistemaRepository : IParametrosSistemaRepository
    {
        private readonly ContextoDb _context;

        public ParametrosSistemaRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<ParametrosSistemaEntidade?> BuscarUnicoRegistro(CancellationToken cancellationToken)
        {
            return await _context.ParametrosSistema.FirstOrDefaultAsync(cancellationToken);
        }
    }
}