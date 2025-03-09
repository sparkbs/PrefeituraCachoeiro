using PrefeituraCachoeiro.Dados.Interfaces;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Repositorios
{
    public class TemplateRepository : ITemplateRepository
    {
        private readonly ContextoDb _context;

        public TemplateRepository(ContextoDb context)
        {
            _context = context;
        }

        public async Task<TemplateEntidade> InserirAsync(TemplateEntidade template, CancellationToken cancellationToken)
        {
            await _context.TemplateEntidade.AddAsync(template, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return template;
        }
    }
}