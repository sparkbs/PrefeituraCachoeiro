using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class MedicoesProjetoEntidadeMapper : IEntityTypeConfiguration<MedicoesProjetoEntidade>
    {
        public void Configure(EntityTypeBuilder<MedicoesProjetoEntidade> builder)
        {
            builder.ToTable("tb_medicoes_projeto").HasKey(i => i.IdMedicoesProjeto);
            builder.Property(x => x.IdMedicoesProjeto).HasColumnName("idmedicoesprojeto").IsRequired();
            builder.Property(x => x.NumeroMedicao).HasColumnName("numeromedicao").IsRequired();
            builder.Property(x => x.IdContrato).HasColumnName("idcontrato").IsRequired();
            builder.Property(x => x.DataMedicao).HasColumnName("datamedicao").IsRequired();
            builder.Property(x => x.Resumo).HasColumnName("valortotalsolicitado").IsRequired(false).HasColumnType("varchar(5000)");
            builder.Property(x => x.IdStatusMedicao).HasColumnName("idstatusmedicao");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasMany(x => x.Items)
                .WithOne(x => x.MedicoesProjeto)
                .HasForeignKey(x => x.IdMedicoesProjeto)
                .HasConstraintName("medicoes_projetos_items");
        }
    }
}
