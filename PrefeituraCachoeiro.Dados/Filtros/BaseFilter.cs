namespace PrefeituraCachoeiro.Dados.Filtros
{
    public abstract class BaseFilter
    {
        private const int ITEM_POR_PAGINA_PADRAO = 10;
        private const int PAGINA_PADRAO = 1;

        public BaseFilter()
        {
            ItemsPorPagina = ITEM_POR_PAGINA_PADRAO;
            Pagina = PAGINA_PADRAO;
        }

        public int ItemsPorPagina { get; set; }
        public int Pagina { get; set; }
    }
}