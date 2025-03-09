using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ArquivosMedicoesProjetoMapper : IEntityTypeConfiguration<ArquivosMedicoesProjetoEntidade>
    {
        public void Configure(EntityTypeBuilder<ArquivosMedicoesProjetoEntidade> builder)
        {
            builder.ToTable("tb_arquivos_medicoes_projeto").HasKey(i => i.Id);
            builder.Property(x => x.Id).HasColumnName("id").IsRequired();
            builder.Property(x => x.IdMedicoesProjeto).HasColumnName("idmedicoesprojeto").IsRequired(true);
            builder.Property(x => x.ArquivoMedicao).HasColumnName("arquivomedicao").IsRequired(true).HasColumnType("varchar(5000)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired(true);
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao").IsRequired(false);
            builder.Property(x => x.IdOrigemArquivo).HasColumnName("idorigemarquivo").IsRequired(true);

            builder.Property(x => x.Id)
                   .HasColumnName("id")
                   .ValueGeneratedOnAdd()
                   .IsRequired(true);

            builder.HasOne(x => x.MedicoesProjeto)
                   .WithMany(x => x.ArquivosMedicoesProjeto)
                   .HasForeignKey(x => x.IdMedicoesProjeto)
                   .HasConstraintName("fk_arquivos_medicoesprojeto");

        }
    }
}