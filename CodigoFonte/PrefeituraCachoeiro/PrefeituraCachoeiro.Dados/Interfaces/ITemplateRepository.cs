using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface ITemplateRepository
    {
        Task<TemplateEntidade> InserirAsync(TemplateEntidade template, CancellationToken cancellationToken);
    }
}