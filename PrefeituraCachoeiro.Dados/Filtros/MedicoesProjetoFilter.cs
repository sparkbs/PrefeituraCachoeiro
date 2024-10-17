using PrefeituraCachoeiro.Dominio.Enumeradores;

namespace PrefeituraCachoeiro.Dados.Filtros
{
    public class MedicoesProjetoFilter: BaseFilter
    {
        public int IdContrato { get; set; }
        public StatusMedicao? StatusMedicao { get; set; }
        public int? IdMedicaoAtual { get; set; }

        public MedicoesProjetoFilter()
        {

        }

        public MedicoesProjetoFilter(int idContrato, StatusMedicao statusMedicao)
        {
            IdContrato = idContrato;
            StatusMedicao = statusMedicao;
        }

        public MedicoesProjetoFilter(int idContrato, StatusMedicao statusMedicao, int idMedicaoAtual)
            :this(idContrato, statusMedicao)
        {
            IdMedicaoAtual = idMedicaoAtual;
        }
    }
}