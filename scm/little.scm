(define rember
  (lambda (atm lat)
    (cond
      ((null? lat) lat)
      ((eq? (car lat) atm) (cdr lat))
      (else (cons (car lat) (rember atm (cdr lat))))
    )
  )
)

(rember "bosse" (list "kalas" "bosse" "apa"))
