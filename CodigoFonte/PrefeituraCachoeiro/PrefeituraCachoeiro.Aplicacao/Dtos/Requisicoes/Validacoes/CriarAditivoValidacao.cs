using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes.Validacoes
{
    [ExcludeFromCodeCoverage]
    public class CriarAditivoValidacao : AbstractValidator<CriarAditivoRequest>
    {
        public CriarAditivoValidacao()
        {
            RuleFor(x => x.ContratoId)
                .NotEmpty()
                .WithMessage("O ContratoId não pode ser vazio");

            RuleFor(x => x.DataValidadeAditivo)
                .NotEmpty()
                .WithMessage("A data de validade do aditivo não pode ser vazio");

            RuleFor(x => x.TipoAditivo)
                .NotEmpty()
                .WithMessage("O tipo de aditivo não pode ser vazio");

            RuleFor(x => x.DataAssinaturaAditivo)
                .NotEmpty()
                .WithMessage("A data de assinatura do aditivo não pode ser vazia");
        }
    }
}