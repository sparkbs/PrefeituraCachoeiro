namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface ISequenceService
    {
        Task<int> GetNextValueFromContratoSequenceAsync();
    }
}