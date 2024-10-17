namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IUnitOfWork
    {
        Task Commit();
        Task Rollback();
        Task BeginTransaction();
    }
}
