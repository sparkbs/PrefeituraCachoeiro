namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class PaginatedEntity<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalRegistros { get; set; }
    }
}
