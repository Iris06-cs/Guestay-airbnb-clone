# Remove the database file if run multiple times
rm db/dev.db 2> /dev/null || true

# Migrations and seeders

npx dotenv sequelize db:migrate

npx dotenv sequelize db:seed:all

echo "----- Tables Exist? -----"
sqlite3 db/dev.db ".schema"

echo "----- Tables Have Data? -----"
sqlite3 db/dev.db "SELECT 'userNum', count(id) FROM Users;"
sqlite3 db/dev.db "SELECT 'spotNum', count(id) FROM Spots;"
sqlite3 db/dev.db "SELECT 'reviewNum', count(id) FROM Reviews;"
sqlite3 db/dev.db "SELECT 'bookingNum', count(id) FROM Bookings;"
sqlite3 db/dev.db "SELECT 'spotImageNum', count(id) FROM SpotImages;"
sqlite3 db/dev.db "SELECT 'reviewImageNum', count(id) FROM ReviewImages;"
