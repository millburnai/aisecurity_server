import sys
sys.path.insert(1, "../")
import csv
import api.models

FILENAME = "/home/kiosk/Downloads/roster.csv"

with open(FILENAME) as csv_file:
	reader = csv.reader(csv_file)
	for row in reader:
		name = " ".join(row[0].split(", ")[::-1])
		student_id = row[1]
		grade = row[2]
		privilege_granted = True if int(grade)==12 else False
		pathToImage = ""
		models.Student.objects.create(name=name, grade=grade, student_id=student_id,privilege_granted=privilege_granted,pathToImage="")


		
