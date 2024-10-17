using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class LogStatusMedicaoEntidadeMapper : IEntityTypeConfiguration<LogStatusMedicaoEntidade>
    {
        public void Configure(EntityTypeBuilder<LogStatusMedicaoEntidade> builder)
        {
            builder.ToTable("tb_log_status_medicao").HasKey(i => i.IdLogStatusMedicao);
            builder.Property(x => x.IdLogStatusMedicao).HasColumnName("idlogstatusmedicao").IsRequired();
            builder.Property(x => x.IdUsuario).HasColumnName("idusuario").IsRequired();
            builder.Property(x => x.DataLog).HasColumnName("datalog").IsRequired();
            builder.Property(x => x.IdMedicoesProjeto).HasColumnName("idmedicoesprojeto").IsRequired();
            builder.Property(x => x.IdStatusMedicao).HasColumnName("idstatusmedicao");
            builder.Property(x => x.MotivoStatusMedicao).HasColumnName("motivostatusmedicao").IsRequired(false).HasColumnType("varchar(500)");
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();

            builder.HasOne(x => x.MedicoesProjeto)
                   .WithMany(x => x.LogStatusMedicao)
                   .HasForeignKey(x => x.IdMedicoesProjeto)
                   .HasConstraintName("fk_log_status_medicoesprojeto_medicoes_projeto");

            builder.HasOne(x => x.StatusMedicao)
                   .WithMany(x => x.LogStatusMedicao)
                   .HasForeignKey(x => x.IdStatusMedicao)
                   .HasConstraintName("fk_log_status_medicoesprojeto_status_medicao");

            builder.HasOne(x => x.Usuario)
                   .WithMany(x => x.LogStatusMedicao)
                   .HasForeignKey(x => x.IdUsuario)
                   .HasConstraintName("fk_log_status_medicoesprojeto_usuario");

        }
    }
}