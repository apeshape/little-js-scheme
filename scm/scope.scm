(define afunc (lambda (a b) (cons a b)))
(afunc 7 (afunc 4 (list 3 2 1)))