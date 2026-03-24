import subprocess
try:
    res = subprocess.check_output(['git', 'diff', 'HEAD', 'README.md'], universal_newlines=True)
    print(res)
except Exception as e:
    print(e)
