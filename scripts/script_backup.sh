#!/bin/bash

# configurações
USER="root"
DATABASE="sorteio"
BACKUP_DIR="/home/mateus/backups"
LOG_DIR="/home/mateus/logs"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

LOG_FILE="$LOG_DIR/backup_mysql.log"


# criar pastas

mkdir -p $BACKUP_DIR
mkdir -p $LOG_DIR


echo "==========================================" >> $LOG_FILE

echo "Inicio do backup: $DATE" >> $LOG_FILE


# executa backup 
/usr/bin/mysqldump $DATABASE > $BACKUP_DIR/backup_$DATABASE_$DATE.sql 2>> $LOG_FILE

# verifica se deu erro
if [ $? -eq 0 ]; 
then
	echo "Backup realizado com sucesso" >> $LOG_FILE

	# compactar
	gzip $BACKUP_DIR/backup_$DATABASE_$DATE.sql
	echo "Backup compactado" >> $LOG_FILE
else 
	echo "ERRO ao realizar backup!" >> $LOG_FILE
fi

# limpar backups antigos (+7 dias)
/usr/bin/find $BACKUP_DIR -type f -mtime +7 -name "*.gz" -exec rm -f {} \; 2>> $LOG_FILE

echo "Fim do processo: $(date +"%Y-%m-%d_%H-%M-%S")" >> $LOG_FILE
echo "" >> $LOG_FILE









