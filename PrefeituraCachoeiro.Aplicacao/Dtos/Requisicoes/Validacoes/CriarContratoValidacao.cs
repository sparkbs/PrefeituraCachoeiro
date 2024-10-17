using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class CriarContratoValidacao : AbstractValidator<CriarContratoRequest>
    {
        public CriarContratoValidacao()
        {

            RuleFor(x => x.IdProjeto)
                .NotEmpty()
                .WithMessage("O identificador do projeto não pode ser vazio");

            RuleFor(x => x.DataContrato)
                .NotEmpty()
                .WithMessage("A data do contrato não pode ser vazia");
        }
    }
}