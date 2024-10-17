using FluentValidation.Results;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ValidationError : Error
    {
        public ValidationError(List<ValidationFailure> validations)
        {
            var errors = validations.Select(x => $"{x.PropertyName} - {x.ErrorMessage}");
            Message = string.Join(", ", errors);
        }
    }
}
