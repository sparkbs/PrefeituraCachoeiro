using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ContratosEntidadeMapper : IEntityTypeConfiguration<ContratosEntidade>
    {
        public void Configure(EntityTypeBuilder<ContratosEntidade> builder)
        {
            builder.ToTable("tb_contratos").HasKey(i=> i.IdContrato);
            builder.Property(x => x.DataContrato).HasColumnName("datacontrato").IsRequired();
            builder.Property(x => x.NumeroContrato).HasColumnName("numerocontrato").IsRequired().HasColumnType("varchar(50)");
            builder.Property(x => x.ValorTotalPrevisto).HasColumnName("valortotalprevisto");
            builder.Property(x => x.ValorTotalSolicitado).HasColumnName("valortotalsolicitado");
            builder.Property(x => x.ValorTotalMedido).HasColumnName("valortotalmedido");
            builder.Property(x => x.ValorSaldoRestante).HasColumnName("valorsaldorestante");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
            builder.Property(x => x.EmpresaId).HasColumnName("empresaId").IsRequired(false);
            builder.Property(x => x.Valor).HasColumnName("valor").IsRequired(false);
            builder.Property(x => x.TipoContratacao).HasColumnName("tipocontratacao").IsRequired(false);
            builder.Property(x => x.Gerente).HasColumnName("gerente").IsRequired(false).HasColumnType("varchar(200)");
            builder.Property(x => x.DataTermino).HasColumnName("datatermino").IsRequired(false);
            builder.Property(x => x.DataInicio).HasColumnName("datainicio").IsRequired(false);
            builder.Property(x => x.PrefeituraId).HasColumnName("prefeituraId").IsRequired(false);
            builder.Property(x => x.Aditivo).HasColumnName("Aditivo").IsRequired(false);
            builder.Property(x => x.TipoAditivo).HasColumnName("tipoaditivo").IsRequired(false).HasColumnType("varchar(200)");
            builder.Property(x => x.DataAssinaturaAditivo).HasColumnName("dataassinaturaaditivo").IsRequired(false);
            builder.Property(x => x.DataValidadeAditivo).HasColumnName("datavalidadeaditivo").IsRequired(false);
            builder.Property(x => x.IdTemplate).HasColumnName("idtemplate").IsRequired(false);

            builder.Property(x => x.IdContrato)
                   .HasColumnName("idcontrato")
                   .ValueGeneratedOnAdd()
                   .IsRequired();

            builder.HasMany(x => x.Items)
                   .WithOne(x => x.Contrato)
                   .HasForeignKey(x => x.ContratosId)
                   .HasConstraintName("fk_contratos_items");

            builder.HasMany(x => x.MedicoesProjeto)
                   .WithOne(x => x.Contratos)
                   .HasForeignKey(x => x.IdContrato)
                   .HasConstraintName("fk_contratos_medicoesprojeto");

            builder.HasOne(x => x.Empresa)
                   .WithMany(x => x.Contratos)
                   .HasForeignKey(x => x.EmpresaId)
                   .HasConstraintName("fk_contratos_empresas");

            builder.HasOne(x => x.Prefeitura)
                   .WithMany(x => x.Contratos)
                   .HasForeignKey(x => x.PrefeituraId)
                   .HasConstraintName("fk_contratos_prefeituras");

            builder.HasMany(x => x.Projetos)
                   .WithOne(x => x.Contratos)
                   .HasForeignKey(x => x.IdContrato)
                   .HasConstraintName("fk_contratos_projetos");

        }
    }
}