# id_6
git checkout -b feature/id_6 develop-clean
git checkout 38dec41 -- .
git add .
git commit -m "feat: seed data"
git checkout develop-clean
git merge --no-ff feature/id_6 -m "Merge pull request #6 from htkhoaa/feature/id_6_seed_data"
git branch -d feature/id_6

# id_7
git checkout -b feature/id_7 develop-clean
git checkout de3558f -- .
git add .
git commit -m "feat: build FS dashboard admin"
git checkout develop-clean
git merge --no-ff feature/id_7 -m "Merge pull request #7 from htkhoaa/feature/id_7_dashboard_admin"
git branch -d feature/id_7

# bugfix
git checkout -b bugfix/fix_student develop-clean
git checkout 4acebe5 -- .
git add .
git commit -m "bugfix: redirect student to profile page after login"
git checkout develop-clean
git merge --no-ff bugfix/fix_student -m "Merge pull request #8 from htkhoaa/bugfix/fix_student_profile"
git branch -d bugfix/fix_student

# id_8
git checkout -b feature/id_8 develop-clean
git checkout 0e26238 -- .
git add .
git commit -m "API get list classes for dropdown"
git checkout develop-clean
git merge --no-ff feature/id_8 -m "Merge pull request #9 from htkhoaa/feature/id_8_read_classes"
git branch -d feature/id_8

# id_9_crud
git checkout -b feature/id_9_crud develop-clean
git checkout 68dfc9f -- .
git add .
git commit -m "feat: implement crud students"
git checkout develop-clean
git merge --no-ff feature/id_9_crud -m "Merge pull request #10 from htkhoaa/feature/id_9_crud_student"
git branch -d feature/id_9_crud

# id_9_create
git checkout -b feature/id_9_create develop-clean
git checkout a66f35c -- .
git add .
git commit -m "feat: implement create student API"
git checkout develop-clean
git merge --no-ff feature/id_9_create -m "Merge pull request #11 from htkhoaa/feature/id_9_create_student"
git branch -d feature/id_9_create

# id_9_read
git checkout -b feature/id_9_read develop-clean
git checkout 9187009 -- .
git add .
git commit -m "feat: implement get student API"
git checkout develop-clean
git merge --no-ff feature/id_9_read -m "Merge pull request #12 from htkhoaa/feature/id_9_read_student"
git branch -d feature/id_9_read

# id_9_update
git checkout -b feature/id_9_update develop-clean
git checkout 11834f1 -- .
git add .
git commit -m "feat: implement update student API"
git checkout develop-clean
git merge --no-ff feature/id_9_update -m "Merge pull request #13 from htkhoaa/feature/id_9_update_student"
git branch -d feature/id_9_update

# id_9_delete
git checkout -b feature/id_9_delete develop-clean
git checkout f3beeb6 -- .
git add .
git commit -m "feat: implement delete student API"
git checkout develop-clean
git merge --no-ff feature/id_9_delete -m "Merge pull request #14 from htkhoaa/feature/id_9_delete_student"
git branch -d feature/id_9_delete

# id_10
git checkout -b feature/id_10 develop-clean
git checkout 5103a77 -- .
git add .
git commit -m "feat: build student table and class table ui"
git checkout develop-clean
git merge --no-ff feature/id_10 -m "Merge pull request #15 from htkhoaa/feature/id_10_student_table_ui"
git branch -d feature/id_10

# id_11
git checkout -b feature/id_11 develop-clean
git checkout 8c284b3 -- .
git add .
git commit -m "feat: build modal for create and edit, integrate full crud api"
git checkout develop-clean
git merge --no-ff feature/id_11 -m "Merge pull request #16 from htkhoaa/feature/id_11_form_create_edit_ui"
git branch -d feature/id_11

# id_12
git checkout -b feature/id_12 develop-clean
git checkout e47e28c -- .
git add .
git commit -m "feat: implement password change API"
git checkout develop-clean
git merge --no-ff feature/id_12 -m "Merge pull request #17 from htkhoaa/feature/id_12_password_change"
git branch -d feature/id_12

# id_13
git checkout -b feature/id_13 develop-clean
git checkout 3f97dda -- .
git add .
git commit -m "feat: implement get my class API, refactor code"
git checkout develop-clean
git merge --no-ff feature/id_13 -m "Merge pull request #18 from htkhoaa/feature/id_13_read_my_class"
git branch -d feature/id_13

# id_14
git checkout -b feature/id_14 develop-clean
git checkout 30e74fd -- .
git add .
git commit -m "feat: build and integrate student profile ui"
git checkout develop-clean
git merge --no-ff feature/id_14 -m "Merge pull request #19 from htkhoaa/feature/id_14_student_profile_ui"
git branch -d feature/id_14

# id_15
git checkout -b feature/id_15 develop-clean
git checkout 7c57f5a -- .
git add .
git commit -m "feat: build and integrate password change UI"
git checkout develop-clean
git merge --no-ff feature/id_15 -m "Merge pull request #20 from htkhoaa/feature/id_15_password_change_ui"
git branch -d feature/id_15

# id_16
git checkout -b feature/id_16 develop-clean
git checkout 67d95a1 -- .
git add .
git commit -m "feat: build and integrate my class UI"
git checkout develop-clean
git merge --no-ff feature/id_16 -m "Merge pull request #21 from htkhoaa/feature/id_16_my_class_ui"
git branch -d feature/id_16

# id_17
git checkout -b test/id_17 develop-clean
git checkout 5c23f43 -- .
git add .
git commit -m "review, refactor all"
git checkout develop-clean
git merge --no-ff test/id_17 -m "Merge pull request #22 from htkhoaa/test/id_17_review"
git branch -d test/id_17

# refactor cuối
git checkout 5087f84 -- .
git add .
git commit -m "refactor"

# Kiểm tra graph
git log --oneline --graph