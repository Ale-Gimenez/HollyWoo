import bcrypt

print("admin123:", bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode())
print("mary123:", bcrypt.hashpw(b"mary123", bcrypt.gensalt()).decode())