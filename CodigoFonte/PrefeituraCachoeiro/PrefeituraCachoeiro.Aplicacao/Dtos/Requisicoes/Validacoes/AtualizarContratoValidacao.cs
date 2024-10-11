using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarContratoValidacao : AbstractValidator<AtualizarContratosRequest>
    {
        public AtualizarContratoValidacao()
        {

            RuleFor(x => x.IdProjeto)
                .NotEmpty()
                .WithMessage("O identificador do projeto não pode ser vazio");

            RuleFor(x => x.DataContrato)
                .NotEmpty()
                .WithMessage("A data do contrato não pode ser vazia");

            RuleFor(x => x.NumeroContrato)
                .NotEmpty()
                .WithMessage("O número do contrato não pode ser vazio");

            RuleFor(x => x.NumeroContrato)
                .MaximumLength(50)
                .WithMessage("O número do contrato não pode ser maior do que 50 caracteres");
        }
    }
}